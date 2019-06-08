import React, {Fragment} from 'react';
import PropTypes from "prop-types";
import { generateIntegers } from "./../utils/randomNumberGenerator";
import {
  Table,
  Button,
  Input, Label,
  Toast, ToastBody, ToastHeader
} from 'reactstrap'
import './styles.css'

export default class InitTracker extends React.Component {
  static propTypes = {
    players: PropTypes.array,
    socket: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.socket = this.props.socket
    this.name = this.socket.io.opts.query.name

    this.state = {
      players: [],//this.props.players.sort((a, b) => {return b.init - a.init}),
      init: null,
    };

    this.socket.on("initiativeUpdate", players => this.setState({
      players: players.sort((a, b) => {return b.initiative - a.initiative})
    }));
  }

  render(){
    var playersRows = [];
    var modifier = 0;

    var rollInit = () => {
      generateIntegers(
        (vals) => {
          sendInit(vals[0] + modifier)
        },
        { n: 1, min: 1, max: 20, replacement: true }
      )
    }

    var sendInit = (newInit) => {
      this.socket.emit("updateInitiative", {
        id: this.socket.id,
        name: this.name,
        init: newInit
      });
    }

    var displayInitRoller = () => {
      return (
        <Fragment>
        modifier
        <Label>
          <Input
            type="number"
            onChange={e => modifier = +e.target.value}
            placeholder={modifier}
            className={"diceInput"}
          />
        </Label>
          <Button
            onClick={rollInit}
            style = {{marginRight: '1em'}}
            block={true}
          > Roll Initiative </Button>
        </Fragment>
      )
    }

    this.state.players.forEach((player, i)=>{
      playersRows.push(
        <tr key={i}>
          <td>{player.name}</td>
          <td>{player.initiative}</td>
        </tr>
      )
    })

    return(
      <Toast>
        <ToastHeader>
          Initiative Tracker
        </ToastHeader>
        <ToastBody>
          <Table className={"table-dark table-striped"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Initiative</th>
              </tr>
            </thead>
            <tbody>
              {playersRows}
            </tbody>
          </Table>
          {displayInitRoller()}
        </ToastBody>
      </Toast>
    )
  }
}