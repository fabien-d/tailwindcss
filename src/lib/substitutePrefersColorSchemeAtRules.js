import _ from 'lodash'
import buildMediaQuery from '../util/buildMediaQuery'

export default function({ theme }) {
  return function(css) {
    css.walkAtRules('prefers-color-scheme', atRule => {
      const colorScheme = atRule.params

      if (!_.has(theme['prefers-color-scheme'], colorScheme)) {
        throw atRule.error(`No \`${colorScheme}\` prefers-color-scheme found.`)
      }

      atRule.name = 'media'
      atRule.params = buildMediaQuery({
        raw: `(prefers-color-scheme: ${theme['prefers-color-scheme'][colorScheme]})`,
      })
    })
  }
}
