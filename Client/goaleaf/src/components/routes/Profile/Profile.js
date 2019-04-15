import React, { Component } from 'react'
import './Profile.scss'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

class Profile extends Component {

    state = {
        login: '',
        username: '',
        oldPassword: '',
        newPassword: '',
        matchingNewPassword: '',
        id: '',
        emailAddress: '',
        errorMsg: '',
        picture: null,
        picPreview: null,
        
        confirmDelete: false
    };
    
    handleChangeAvatar = e => {
        e.preventDefault();

        if (e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)){

        const blob = new Blob([e.target.files[0]], {type: "image/png"});
        const formData = new FormData();
        formData.append('file', blob); 

        axios.post(`/uploadImage?token=${localStorage.getItem("token")}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            axios.get(`/downloadFile/${this.props.userLogged}`, { responseType: 'arraybuffer' })
            .then(res => {
                const base64 = btoa(
                  new Uint8Array(res.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                  ),
                );
                this.setState({ picture: res.data, picPreview: "data:;base64," + base64 });
              })
                
                .catch(err => {}) 
            }
            ).catch(err => {})
        }
    }

    handlePasswordChange = e => {
        e.preventDefault();
        axios.put('/api/users/edit', {
            "token": localStorage.getItem("token"),
            "emailAddress": '',
            "id": this.state.id,
            "matchingNewPassword": this.state.matchingNewPassword,
            "newPassword": this.state.newPassword,
            "oldPassword": this.state.oldPassword,
            "userName": ''
        })
        .then(res => {
                this.setState({ errorMsg: 'Edit successful!' })
            }
            ).catch(err => this.setState({errorMsg: err.response.data.message}))
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleDelete = event => {
        axios.delete(`/api/users/user/${this.props.userLogged}`)
            .then(res => {
                console.log(res.data)
            }
            ).catch(err => this.setState({ errorMsg: err.response.data.message }))
    }

    componentDidMount() {
        axios.get(`/api/users/user/${this.props.userLogged}`)
            .then(res => {
                console.log(res.data)
                this.setState({
                    username: res.data.username,
                    emailAddress: res.data.emailAddress,
                    login: res.data.login,
                    id: res.data.id
                })
            }
            ).catch(err => this.setState({ errorMsg: err.response.data.message }))

        axios.get(`/downloadFile/${this.props.userLogged}`, { responseType: 'arraybuffer' })
        .then(res => {
            const base64 = btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );
            this.setState({ picture: res.data, picPreview: "data:;base64," + base64 });
          })
            
            .catch(err => this.setState({ errorMsg: err.response.data.message })) 
    }


    render() {
        let deleteAccount = ''
        if (this.state.confirmDelete === true) {

            deleteAccount =  <div className="confirm-delete-profile">
                <span>Are you sure you want to delete your account?</span>
                <input type="button" value="Delete my account" onClick={this.handleDelete}></input>
            </div>
        }
        let errorMsg = <div className="errorMsg">{this.state.errorMsg}</div>
        return (
            <div className="Profile">
                <section className="profile-photo">
                    <img src={this.state.picPreview} alt="user avatar"/>
                    <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.handleChangeAvatar} ref="uploadPhoto" style={{display: "none"}} />
                    <input className="upload-photo-btn" type="button" value="change photo" onClick={() => this.refs.uploadPhoto.click()}  />
                </section>
                <section className="profile-info">
                    <h1>{this.state.login} </h1>
                    <h2>{this.state.emailAddress} </h2>
                </section>
                <section className="change-password">
                    <form onSubmit={this.handlePasswordChange} autoComplete="off">
                            <h2>Change password</h2>
                            <input className="password-input" type="password" id="oldPassword" placeholder="old password" onChange={this.handleChange} />
                            <input className="password-input" type="password" id="newPassword" placeholder="new password" onChange={this.handleChange} />
                            <input className="password-input" type="password" id="matchingNewPassword" placeholder="repeat new password" onChange={this.handleChange} />
                            <input className="change-password-btn" type="submit" value="submit" />
                            {errorMsg}
                    </form>
                </section>
                <section className="delete-profile">
                    <input className="delete-profile-btn" type="button" value="Delete account" onClick={e => this.setState({confirmDelete: true })}/>
                    {deleteAccount}
                </section>
            </div>
        )
    }

}
const mapStateToProps = state => ({
    userLogged: state.userLogged
})

export default connect(mapStateToProps)(Profile);