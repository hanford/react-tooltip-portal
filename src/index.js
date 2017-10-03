import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import document from 'global/document'

const TOP = 'top'
const LEFT = 'left'
const BOTTOM = 'bottom'
const RIGHT = 'right'

export default class TooltipPortal extends PureComponent {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    offset: PropTypes.number.isRequired,
    position: PropTypes.string,
    tipStyle: PropTypes.object,
    timeout: PropTypes.number,
  }

  static defaultProps = {
    active: false,
    offset: 10,
    position: 'left',
    tipStyle: {},
    timeout: 750
  }

  state = {
    hover: false,
    timeout: () => {},
    show: this.props.active
  }

  onMouseEnter = () => {
    clearTimeout(this.state.timeout)

    this.setState({ hover: true })
  }

  onMouseLeave = () => {
    this.setState({
      hover: false
    }, this.setHoverTimeout)
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.active && !nextState.show) {
      this.setState({ show: true })
    }

    if (!nextProps.active && !nextState.hover) {
      this.setHoverTimeout()
    }
  }

  setHoverTimeout = () => {
    clearTimeout(this.state.timeout)

    this.setState({
      timeout: setTimeout(() => {
        if (!this.state.hover) {
          this.setState({ show: false })
        }
      }, this.props.timeout)
    })
  }

  render () {
    if ((!this.props.active && !this.state.show && !this.state.hover) || !this.props.parent) return null

    return createPortal(
      <Tooltip
        active={this.props.active || this.state.hover}
        parent={this.props.parent}
        offset={this.props.offset}
        position={this.props.position}
        tipStyle={this.props.tipStyle}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this.props.children}
      </Tooltip>,
      document.body,
    )
  }
}

class Tooltip extends PureComponent {

  state = {
    top: 0,
    left: 0
  }

  componentDidMount () {
    this.getTipPosition()
  }

  componentWillUpdate () {
    this.getTipPosition()
  }

  getTipPosition = () => {
    const { parent, position, offset } = this.props
    if (!this.tip) return

    let scrollY = (window.scrollY !== undefined) ? window.scrollY : window.pageYOffset
    let scrollX = (window.scrollX !== undefined) ? window.scrollX : window.pageXOffset

    const pNode = parent.getBoundingClientRect()
    const tipNode = this.tip.getBoundingClientRect()

    let top
    let left

    switch (position) {
      case TOP:
        top = scrollY + pNode.top - tipNode.height - offset
        left = scrollX + pNode.left + (pNode.width / 2) - (tipNode.width / 2)
        break

      case LEFT:
        top = scrollY + pNode.top + (pNode.height / 2) - offset
        left = scrollX + pNode.left - offset - tipNode.width
        break

      case BOTTOM:
        top = scrollY + pNode.top + pNode.height + offset
        left = scrollX + pNode.left + (pNode.width / 2) - (tipNode.width / 2)
        break

      case RIGHT:
        top = scrollY + pNode.top + (pNode.height / 2) - offset
        left = scrollX + pNode.left + pNode.width + offset
        break

      default:
    }

    this.setState({ top, left })
  }

  render () {
    const { tipStyle, onMouseLeave, onMouseEnter } = this.props
    const { top, left } = this.state

    return (
      <div
        ref={c => this.tip = c}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'absolute',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: 8,
          top,
          left,
          ...tipStyle
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
