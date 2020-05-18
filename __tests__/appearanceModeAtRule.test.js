import postcss from 'postcss'
import plugin from '../src/lib/substituteAppearanceModeAtRules'
import config from '../stubs/defaultConfig.stub.js'

function run(input, opts = config) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

test('it can generate appearance mode variants', () => {
  const input = `
    @appearance-mode {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }

    @tailwind prefers-color-scheme
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      @media (prefers-color-scheme: dark) {
        .prefers-dark\\:banana { color: yellow; }
        .prefers-dark\\:chocolate { color: brown; }
      }
      @media (prefers-color-scheme: light) {
        .prefers-light\\:banana { color: yellow; }
        .prefers-light\\:chocolate { color: brown; }
      }
  `

  return run(input, {
    separator: ':',
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})
