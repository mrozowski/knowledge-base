import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import '../../common/button';
import { Icons } from '../../common/icons';
import { Styles } from '../../common/styles';
import KDatasource from '../../config/configuration';
import { Pages } from '../../page-definition';
import { GoBack, LinkTo } from '../../system/router';
import { ButtonType } from '../../common/button';


@customElement('login-page')
export class Login extends LitElement {

    private user: string = "";
    private password: string = "";

    private login = () => {
        KDatasource.login(this.user, this.password)
            .then(_user => {
                LinkTo(Pages.HOME);
            }).catch(e => {
                console.log(e);
            })
    }

    setUser = (value) => {
        this.user = value.target.value;
    }

    setPassword = (value) => {
        this.password = value.target.value;
    }

    render() {
        return html`
        <div class="container">
            <form action="#" class="signin-form">
                <div class="cridentials">
                    <label class="label" for="name">Username</label>
                    <input type="text" class="form-control" placeholder="Username" required @keyup=${(e) => this.setUser(e)}>
                </div>
                <div class="cridentials">
                    <label class="label" for="password">Password</label>
                    <input type="password" class="form-control" placeholder="Password" required @keyup=${(e) => this.setPassword(e)}>
                </div>
                <div class="form-group">
                <button-x .text=${"Sign In"} @click=${() => this.login()}></button-x>
                </div>
            
                <div class="options">
                    <label class="checkbox-wrap checkbox-primary mb-0">Remember Me
                        <input type="checkbox" checked="">
                        <span class="checkmark"></span>
                    </label>
                    <div>
                        <a href="#">Forgot Password</a>
                    </div>
                </div>
            </form>

            
        </div>
        <div class="back-to-home">
            <div class="arrow">
                 ${unsafeHTML(Icons.arrowLeft)}
             </div>
             <button-x .text=${"Back"} @click=${() => LinkTo(Pages.HOME)} .type=${ButtonType.SECONDARY}></button-x>
        </div>
        
        `
    }

    static get styles() {
        return [Styles.VARIABLES, css`
        .container{
            width: 20rem;
            margin: 0 auto;
            height: 100vh;
            display: flex;
            align-items: center;
        }
        
        .signin-form{
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        .cridentials{
            margin-bottom: 0.8rem;
        }

        .form-group{
            margin: 0.5rem auto;
        }

        .options{
            margin-top: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .back-to-home{
            position: absolute;
            width: fit-content;
            left: 0px;
            right: 0px;
            margin: 0px auto;
            bottom: 1.5rem;
            display: flex;
            align-items: center;
        }

        .arrow{
            margin-top: 0.4rem;
            fill: var(--tertiary--text-color);
            width: 1.3rem;
        }

        a{
            text-decoration: none;
            color: var(--tertiary--text-color);
            transition: color 0.25s ease-out;
        }

        a:active{
            color: var(--secondary-text-color);
        }

        a:hover{
            color: var(--secondary-text-color);;
            cursor: pointer;
        }

        label{
            color: var(--secondary-text-color);
            font-size: 80%;
        }

        .cridentials > input{
            background-color: var(--card-background);
            border: none;
            border-radius: 0 8px 8px 8px;
            outline: none;
            resize: none;
            color: var(--textColor);
            width: 100%;
            margin-top: 0.2rem;
            height: 2.5rem;
            padding: 0 0.5rem;
            -moz-box-sizing: border-box; 
            -webkit-box-sizing: border-box; 
            box-sizing: border-box; 
        }
        `];
    }
}

