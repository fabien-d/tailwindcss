import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'
import buildMediaQuery from '../util/buildMediaQuery'
import buildSelectorVariant from '../util/buildSelectorVariant'

export default function(config) {
  return function(css) {
    const { separator } = config
    const darkModeRules = postcss.root()
    const finalRules = []
    const modes = ['dark', 'light']

    css.walkAtRules('dark-mode', atRule => {
      const nodes = atRule.nodes
      darkModeRules.append(...cloneNodes(nodes))
      atRule.before(nodes)
      atRule.remove()
    })

    modes.forEach(colorScheme => {
      const mediaQuery = postcss.atRule({
        name: 'media',
        params: buildMediaQuery({
          raw: `(prefers-color-scheme: ${colorScheme})`,
        }),
      })

      mediaQuery.append(
        _.tap(darkModeRules.clone(), clonedRoot => {
          clonedRoot.walkRules(rule => {
            rule.selectors = _.map(rule.selectors, selector => {
              return buildSelectorVariant(
                selector,
                `prefers-${colorScheme}`,
                separator,
                message => {
                  throw rule.error(message)
                }
              )
            })
          })
        })
      )

      finalRules.push(mediaQuery)
    })

    const hasDarkModeRules = finalRules.some(i => i.nodes.length !== 0)

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params !== 'prefers-color-scheme') {
        return
      }
      if (hasDarkModeRules) {
        atRule.before(finalRules)
      }
      atRule.remove()
    })
  }
}
