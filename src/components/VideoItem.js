import React from 'react'
import Video from 'react-html5video'
import { Link } from 'react-router'
import { DraggableCore } from 'react-draggable'

export default class VideoItem extends React.Component {
  constructor() {
    super()
    this.state = {
      x: 0,
      y: 0,
      style: {
        width: '0px',
        height: '0px',
        transform: 'translate(0px, 0px)'
      }
    }
    this._handleOnCanPlay = this._handleOnCanPlay.bind(this)
    this._handleOnDrag = this._handleOnDrag.bind(this)
    this._handleOnStop = this._handleOnStop.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _handleOnCanPlay() {
    if (!this.props.item.get('isReadyToPlay')) {
      this.props.setVideoReadyToPlay(this.props.id);
    }
  }
  _handleOnDrag(event, ui) {
    const x = this.state.x + ui.position.deltaX
    const y = this.state.y + ui.position.deltaY
    this.setState({
      x: x,
      y: y,
      style: {
        width: this.state.style.width,
        height: this.state.style.height,
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      }
    })
  }
  _handleOnStop(event, ui) {
    const x = this.state.x - this.props.windowWidth
    const y = this.state.y
    this.props.setVideoPosition(this.props.id, x, y)
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.item.get('y') !== nextProps.item.get('y') || this.props.item.get('scaledX') !== nextProps.item.get('scaledX')) {
      this.setState({
        x: nextProps.item.get('scaledX'),
        y: nextProps.item.get('y'),
        style: {
          width: nextProps.item.get('width') + 'px',
          height: nextProps.item.get('height') + 'px',
          transform: 'translate(' + nextProps.item.get('scaledX') + 'px, ' + nextProps.item.get('y') + 'px)'
        }
      })
    }
  }
  componentWillMount() {
    this.setState({
      x: this.props.item.get('scaledX'),
      y: this.props.item.get('y'),
      style: {
        width: this.props.item.get('width') + 'px',
        height: this.props.item.get('height') + 'px',
        transform: 'translate(' + this.props.item.get('scaledX') + 'px, ' + this.props.item.get('y') + 'px)'
      }
    })
  }
  render() {
    const video = (
      <Video key={this.props.key} 
             autoPlay 
             loop 
             muted 
             poster={this.props.item.get('posterUrl')} 
             onCanPlay={this._handleOnCanPlay}
      >
        <source src={this.props.item.get('mediaUrl')} type='video/mp4' />
      </Video>
    )
    if(this.props.item.get('linkedTo')) {
      return (
        <DraggableCore onDrag={this._handleOnDrag} onStop={this._handleOnStop}>
          <div rel='videoItem' className='video-item' style={this.state.style}>
            <Link to={'/' + this.props.item.get('linkedTo')}>
              {video}
            </Link>
          </div>
        </DraggableCore>
      )
    }
    return (
      <DraggableCore onDrag={this._handleOnDrag} onStop={this._handleOnStop}>
        <div rel='videoItem' className='video-item' style={this.state.style}>
          {video}
        </div>
      </DraggableCore>
    )
  }
}
