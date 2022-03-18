import React, { Component } from 'react'

export default class Header extends Component {

    state = {
        show : false
    }

    render() {
        return (
            <div>
                {this.state.show ?(
                <nav className="navbar navbar-dark bg-secondary mb-3 py-0">
                    <a href="/" className="navbar-brand">AREA Menu</a>
                    <ul className="navbar-nav">
                        <li>
                            <a href="/" className="nav-link">Profil</a>
                            <a href="/" className="nav-link">Services connexion</a>
                            <a href="/" className="nav-link">Mes actions</a>
                        </li>
                    </ul>
                </nav>
                ) : null}
            </div>
        )
    }
}
