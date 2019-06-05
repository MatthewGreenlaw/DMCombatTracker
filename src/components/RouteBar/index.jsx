import React, {Fragment} from 'react';
import {
  Jumbotron,
  Navbar, Nav, NavItem, NavbarBrand, NavbarToggler,
  Collapse,
  Button,
  Container,
  Row, Col
} from 'reactstrap'
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import openSocket from 'socket.io-client';


import DiceRoller from './../DiceRoller'
import Entity from "./../Entity";
import DungeonMaster from './../DungeonMaster'
import NewCharacterForm from "./../NewCharacterForm"
import NewDMForm from "./../NewDMForm"
import InitTracker from "./../InitTracker"
import './style.scss'

export default class RouteBar extends React.Component {

  render() {

    var playerData;
    var dmData;
    var newPlayer = true;
    var newDM = true;
    var socket;
    console.log("Generate")

    function DM() {
      if(dmData === undefined)
        return <Redirect to="/addNewDM"/>;

      if(newDM){
        newDM = !newDM;
        socket = openSocket('http://localhost:3001', {query: {type: "DM", name:"Monsters", lobby: dmData.lobby}})
        socket.emit('newDM', {
          lobby:dmData.lobby,
          id: socket.id,
          name: dmData.name,
        })
      }
      return <Container><DungeonMaster socket={socket}/></Container>
    }

    function Player () {
      if(playerData === undefined)
        return <Redirect to="/addNewPlayer"/>;

      //Prevent multiple connections
      if(newPlayer){
        newPlayer = !newPlayer;
        socket = openSocket('http://localhost:3001', {query: {type: "Player", name: playerData.name, lobby: playerData.lobby}})
        socket.emit('newPlayer', {
          lobby: playerData.loby,
          id: socket.id,
          name: playerData.name
        })
      }
      return (
          <Container>
            <Row>
              <Col><InitTracker socket={socket}/></Col>
              <Col></Col>
            </Row>
            <Row>
              <Entity
                name={playerData.name}
                ac={playerData.ac}
                maxHP={playerData.maxHP}
                init={playerData.init}
                socket={socket}
              />
            </Row>
          </Container>
      )
    }

    function playerDataCallback (data) {
      playerData = data;
      //return <Redirect push to='/player'/>
      document.getElementById('player').click()
    }

    function dmDataCallback (data) {
      dmData = data;
      //return <Redirect push to='/player'/>
      document.getElementById('dungionMaster').click()
    }

    function addNewDM() {
      return <Container><NewDMForm callback={dmDataCallback}/></Container>
    }

    function addNewPlayer() {
      return <Container><NewCharacterForm callback={playerDataCallback}/></Container>
    }

    function dice() {
      return <Container><DiceRoller/></Container>
    }


    return (

      <Router>
        <Navbar className={"navbar-dark bg-dark sticky-top"}>
          <NavbarBrand>Combat Tracker</NavbarBrand>
          <Nav>
            <NavItem>
                <Link to="/" className={"nav-link"}>Home</Link>
            </NavItem>
            <NavItem>
                <Link to="/roller/" className={"nav-link"}>Dice Roller</Link>
            </NavItem>
            <NavItem>
                <Link to="/PlayerTracker" id="player" className={"nav-link"}>Player Tracker</Link>
            </NavItem>
            <NavItem>
                <Link to="/DMTracker" id="dungionMaster" className={"nav-link"}>DM Tracker</Link>
            </NavItem>
          </Nav>
        </Navbar>
        <Route
          path="/addNewDM"
          component={addNewDM}
        />
        <Route
          path="/addNewPlayer"
          component={addNewPlayer}
        />
        <Route
          path="/roller"
          component={dice}
        />
        <Route
          path="/PlayerTracker"
          component={Player}
        />
        <Route
          path="/DMTracker"
          component={DM}
        />
      </Router>

    )
  }
}
