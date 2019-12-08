#!/usr/bin/env node

const http = require('http')

http.get(process.env.PINGME_URI, (res) => {
  res.on('end', () => {
    console.log('Done pinging')
  })
}).on('error', console.error)
