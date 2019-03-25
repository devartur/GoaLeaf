import React, { Component } from 'react'
import styles from './Dashboard.module.scss'
import { connect } from 'react-redux'

class Dashboard extends Component {
  render() {
    let user = <div>user not logged</div>
    if(this.props.authenticated) {
      user = <div>hello { this.props.userLogged }</div>
    }
    return (
      <div className={styles.Dashboard}>
        { user }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authenticated,
    userLogged: state.userLogged
  }
}

export default connect(mapStateToProps)(Dashboard);
