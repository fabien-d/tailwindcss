import _ from 'lodash'
import postcss from 'postcss'

import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteAppearanceModeAtRules from './lib/substituteAppearanceModeAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substitutePrefersColorSchemeAtRules from './lib/substitutePrefersColorSchemeAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'
import purgeUnusedStyles from './lib/purgeUnusedStyles'

import corePlugins from './corePlugins'
import processPlugins from './util/processPlugins'

export default function(getConfig) {
  return function(css) {
    const config = getConfig()
    const processedPlugins = processPlugins([...corePlugins(config), ...config.plugins], config)

    return postcss([
      substituteTailwindAtRules(config, processedPlugins),
      evaluateTailwindFunctions(config),
      substituteVariantsAtRules(config, processedPlugins),
      substituteResponsiveAtRules(config),
      substituteAppearanceModeAtRules(config),
      substitutePrefersColorSchemeAtRules(config),
      substituteScreenAtRules(config),
      substituteClassApplyAtRules(config, processedPlugins.utilities),
      purgeUnusedStyles(config),
    ]).process(css, { from: _.get(css, 'source.input.file') })
  }
}
