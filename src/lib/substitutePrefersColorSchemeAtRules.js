import buildMediaQuery from '../util/buildMediaQuery'

export default function() {
  return function(css) {
    css.walkAtRules('prefers-color-scheme', atRule => {
      const colorScheme = atRule.params

      if (colorScheme !== 'dark' && colorScheme !== 'light') {
        throw atRule.error(`No \`${colorScheme}\` prefers-color-scheme found.`)
      }

      atRule.name = 'media'
      atRule.params = buildMediaQuery({
        raw: `(prefers-color-scheme: ${colorScheme})`,
      })
    })
  }
}
