"""
HTTP/request/response utils
"""
from functools import partial
from typing import Awaitable, Callable, Optional, Type, TypeVar, cast

import httpx
from mypy_extensions import DefaultNamedArg
from pydantic import BaseModel, ValidationError


T = TypeVar("T", bound=BaseModel)  # pylint:disable=invalid-name


class BaseApiError(Exception):
    """
    Base API error to extend from. Includes an error code
    """

    def __init__(self, message: str, error_code: int) -> None:
        self.error_code = error_code
        super().__init__(message)


def gen_make_request(
    service_name: str, api_error_cls: Type[BaseApiError]
) -> Callable[
    [
        str,
        str,
        Type[T],
        DefaultNamedArg(str, "access_token"),
        DefaultNamedArg(httpx.models.RequestData, "data"),
    ],
    Awaitable[T],
]:
    """
    Make a request handler for a specific service
    """
    return partial(  # type:ignore
        _make_request_base,
        service_name=service_name,
        api_error_cls=api_error_cls,
    )


async def _make_request_base(
    method: str,
    uri: str,
    model: Type[T],
    *,
    access_token: Optional[str] = None,
    data: Optional[httpx.models.RequestData] = None,
    service_name: str,
    api_error_cls: Type[BaseApiError],
) -> T:
    """
    Make an API request with error handling etc. Coerce to a Pydantic model
    """
    headers = (
        {}
        if access_token is None
        else {"Authorization": f"Bearer {access_token}"}
    )
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method, uri, data=data, headers=headers
        )
    if response.status_code != 200:
        raise api_error_cls(
            f"Unexpected {response.status_code} response from {service_name} "
            f"when retrieving '{model.__name__}': {response.text}",
            error_code=response.status_code,
        )

    try:
        response_json = cast(dict, response.json())
        response_data = model(**response_json)
    except (ValidationError, ValueError) as err:
        raise api_error_cls(
            f"Could not decode response from {service_name} when retrieving "
            f"'{model.__name__}': {err}",
            error_code=500,
        )
    return response_data