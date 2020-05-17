import postcss from 'postcss'
import plugin from '../src/lib/substitutePrefersColorSchemeAtRules'
import config from '../stubs/defaultConfig.stub.js'

function run(input, opts = config) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

test('it can generate media queries from configured prefers-color-scheme', () => {
  const input = `
  @prefers-color-scheme dark {
    .banana { color: yellow; }
  }
  @prefers-color-scheme light {
    .banana { color: red; }
  }
  `

  const output = `
      @media (prefers-color-scheme: dark) {
        .banana { color: yellow; }
      }
      @media (prefers-color-scheme: light) {
        .banana { color: red; }
      }
  `

  return run(input, {
    theme: {
      'prefers-color-scheme': { light: 'light', dark: 'dark' },
    },
    separator: ':',
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})
