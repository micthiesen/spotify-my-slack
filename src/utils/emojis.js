// Map of lowercase strings to emojis. Ordered in decending preference
const EMOJI_MAP = new Map([
  ['alien', ':alien:'],
  ['ufo', ':alien:'],
  ['space', ':alien:'],
  ['innocent', ':innocent:'],
  ['evil', ':smiling_imp:'],
  ['heartbreak', ':heartbreak:'],
  ['heart break', ':heartbreak:'],
  ['broken heart', ':heartbreak:'],
  ['love', ':heart:'],
  ['yum', ':yum:'],
  ['yummy', ':yum:'],
  ['delicious', ':yum:'],
  ['cupid', ':cupid:'],
  ['sweat', ':sweat:'],
  ['sweaty', ':sweat:'],
  ['workout', ':sweat:'],
  ['work out', ':sweat:']
])

module.exports.getStatusEmoji = function (spotifyItem) {
  const stringsToCheck = [spotifyItem.name, spotifyItem.artists[0].name]

  for (const string of stringsToCheck) {
    for (const [alias, emoji] of EMOJI_MAP) {
      var regexp = new RegExp('(^| )' + alias + '( |$)', 'i')
      if (regexp.test(string)) { return emoji }
    }
  }

  return ':headphones:'
}
