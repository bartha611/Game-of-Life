import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlive: [],
      time: 0,
      cells: [],
      play: false
    }
    this.light = this.light.bind(this);
    this.nextGeneration = this.nextGeneration.bind(this);
    this.play = this.play.bind(this);
    this.checkNeighbors = this.checkNeighbors.bind(this);
    this.randomMatrix = this.randomMatrix.bind(this);
  }
  componentDidMount() {
    var item = [];
    var matrix = [];
    for(let i = 0; i < 30; i++) {
      item = [];
      for(let k = 0; k < 60; k++) {
        item.push(<td className = "dead" data-value = {60*i+k} onClick = {this.light}></td>);
      }
      matrix.push(<tr>{item}</tr>)
    }
    this.setState({
      cells: matrix
    })
  }
  checkNeighbors(e) {
    var board = this.state.isAlive;
    var total = 0;
    if(e % 60 !== 0) {
      total += Number(board.indexOf(e - 61) > -1);
      total += Number(board.indexOf(e - 1) > -1);
      total += Number(board.indexOf(e + 59) > -1);
    }
    if((e + 1) % 60 !== 0) {
      total += Number(board.indexOf(e - 59) > -1)
      total += Number(board.indexOf(e + 1) > -1);
      total += Number(board.indexOf(e + 61) > -1);
    }
    total += Number(board.indexOf(e - 60) > -1);
    total += Number(board.indexOf(e + 60) > -1);
    return total
  }
  randomMatrix() {
    var matrix = [];
    var item = [];
    var nextAlive = [];
    var random;
    for(let i = 0; i < 30; i++) {
      item = [];
      for(let k = 0; k < 60; k++) {
        random = Math.round(Math.random());
        if(random === 1) {
          item.push(<td className = 'alive' data-value = {60*i + k} onClick = {this.light}></td>);
        }
        else {
          item.push(<td className = 'dead' data-value = {60*i + k} onClick = {this.light}></td>);
          nextAlive.push(60*i + k);
        }
      }
      matrix.push(<tr>{item}</tr>)
    }
    this.setState({
      cells: [],
      isAlive: nextAlive
    }, () => {
      this.setState({
        cells: matrix
      })
    })
  }
  play() {
    this.setState({
      play: !this.state.play,
      time: 0
    }, () => {console.log(this.state.play)})
  }
  light(e) {
    if(e.target.className === 'dead') {
      e.target.className = 'alive';
      var valueToAdd = parseInt(e.target.dataset.value);
      this.setState({
        isAlive: [...this.state.isAlive,valueToAdd]
      }, () => {console.log(this.state.isAlive)})
    }
    else {
      e.target.className = 'dead';
      var valueToRemove = parseInt(e.target.dataset.value);
      var newState = this.state.isAlive.filter(item => item !== valueToRemove);
      this.setState({
        isAlive: newState
      }, () => {console.log(this.state.isAlive)})
    }
  }
  nextGeneration() {
    var newMatrix = [];
    var newItem = [];
    var nextAlive = [];
    var totalNeighbors;
    var board = this.state.isAlive;
    for(let i = 0; i < 30; i++) {
      newItem = [];
      for(let k = 0; k < 60; k++) {
        totalNeighbors = this.checkNeighbors(60*i + k);
        if(totalNeighbors < 2 || totalNeighbors > 3) {
          newItem.push(<td className = 'dead' data-value = {60*i + k} onClick = {this.light}></td>);
        }
        else if(totalNeighbors === 2 && board.indexOf(60*i + k) === -1) {
          newItem.push(<td className = "dead" data-value = {60*i + k} onClick = {this.light}></td>);
        }
        else {
          newItem.push(<td className = 'alive' data-value = {60*i + k} onClick = {this.light}></td>);
          nextAlive.push(60*i + k);        
        }
      }
      newMatrix.push(<tr>{newItem}</tr>)
    }
    this.setState({
      cells: [],
      time: this.state.time + 1,
      isAlive: nextAlive
    }, () => {
      this.setState({
        cells: newMatrix
      })
    })
  }
  render() {
    var buttonMap;
    if(this.state.play) {
      buttonMap = 
                  <Timer nextGeneration = {this.nextGeneration} 
                  play = {this.play} 
                  time = {this.state.time} />
    }
    else {
      buttonMap = 
                  <div className = "buttonMenu col-sm-2 mt-4">
                    <div id="time">{this.state.time}</div>
                    <button className="btn btn-success container-fluid" onClick = {this.play}>Start</button>
                    <button className = "btn btn-success container-fluid mt-2" onClick = {this.randomMatrix}>Randomize</button>
                  </div>
    }
    return (
      <div className = "container">
        <h1 className = "title text-center">Conway's Game of Life</h1>
        <table id = "board">
          <tbody>
            {this.state.cells}
          </tbody>
        </table>
        {buttonMap}
      </div>
    )
  }
}
class Timer extends Component {
  componentDidMount() {
    this.interval = setInterval(this.props.nextGeneration,100)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    return(
      <div className = "buttonMenu col-sm-2 mt-4">
        <div id="time">{this.props.time}</div>
        <button className="btn btn-success container-fluid" onClick = {this.props.play}>Stop</button>
      </div>
    )
  }
}