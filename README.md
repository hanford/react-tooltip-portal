## react-tooltip-portal

Small, unopinionated react tooltip library built using react 16's portal API.

## Install

```
$ npm install react-tooltip-portal --save
```

## Usage

```js
import Tooltip from 'react-tooltip-portal'

class App extends Component {
  state = {
    tipActive: false
  }

  render () {
    return (
      <div className="App">
        <img
          src={logo}
          ref={c => this.tipRef = c}
          onMouseEnter={() => this.setState({ tipActive: true })}
          onMouseLeave={() => this.setState({ tipActive: false })}
        />

        <Tooltip
          active={this.state.tipActive}
          parent={this.tipRef}
          position='left'
          tipStyle={{color: 'red'}}
        >
          <div>Im a tool tip!</div>
        </Tooltip>
      </div>
    )
  }
}
```

### Props

* `active`: boolean, the tooltip will be visible if true
* `position`: top, right, bottom or left. Default to left.
* `parent`: the tooltip will be placed next to this element, must be a react ref
* `timeout`: amount of time to allow for user to hover over tooltip (will stay open if hovering regardless of props.active)
* `tipStyle`: object, override any of the tool tips default styles

MIT © [Jack Hanford](http://jackhanford.com)
