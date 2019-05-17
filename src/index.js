import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import document from 'global/document'
import window from 'global/window'
import {canUseDOM} from 'exenv'

const TOP = 'top'
const LEFT = 'left'
const BOTTOM = 'bottom'
const RIGHT = 'right'

const SafeElement = canUseDOM ? window.Element : {}

export default class TooltipPortal extends PureComponent {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    parent: PropTypes.instanceOf(SafeElement).isRequired,
    children: PropTypes.node.isRequired,
    offset: PropTypes.number,
    position: PropTypes.string,
    tipStyle: PropTypes.object,
    hoverEvents: PropTypes.bool,
    timeout: PropTypes.number,
    className: PropTypes.string
  }

  static defaultProps = {
    active: false,
    hoverEvents: true,
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
    const {
      active,
      parent,
      offset,
      position,
      tipStyle,
      hoverEvents,
      children,
      className
    } = this.props;

    const { show, hover } = this.state;

    if ((!active && !show && !hover) || !parent || (!active && !hoverEvents)) return null

    return createPortal(
      <Tooltip
        active={active || hover}
        parent={parent}
        offset={offset}
        position={position}
        tipStyle={tipStyle}
        className={className}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {children}
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
    const { tipStyle, onMouseLeave, onMouseEnter, className } = this.props
    const { top, left } = this.state

    return (
      <div
        ref={c => this.tip = c}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'absolute',
          zIndex: 1000,
          top,
          left,
          ...tipStyle
        }}
        className={className}
      >
        {this.props.children}
      </div>
    )
  }
}
