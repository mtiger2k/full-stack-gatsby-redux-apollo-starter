import React from 'react'
import { Button } from '@magicsoup.io/stock'
import { Box } from '@magicsoup.io/stock'
import { navigate } from '@reach/router'
import gql from 'graphql-tag'

import { Input, Label, P } from '../../styled'
import store from '../../redux/store'
import Cookies from 'universal-cookie'
import client from '../../apollo/client'
import { loginUser } from '../../redux/actions/userActions'


class Form extends React.Component {
  constructor(props) {
    super(props)
    this.emailInput = React.createRef()
    this.passwordInput = React.createRef()
    this.state = {
      login: '',
      password: '',
      data: null,
    }
  }

  onSubmit = async (e) => {
    e.preventDefault()

    const {
      login,
      password,
    } = this.state


    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: {
        login,
        password,
      },
    })

    this.setState(data.signIn)
    store.dispatch(loginUser(data.signIn))

    if (data.signIn) localStorage.setItem('bearer_token', data.signIn.token)
    else localStorage.removeItem('bearer_token')

    if (data && data.signIn) {
      navigate('/app/profile')
    }
  }

  onChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }


  render = () => {
    const {
      email,
      password,
      data,
    } = this.state

    return (
      <form onSubmit={this.onSubmit}>
        <P>
          For this demo, please log in with the email <code>demo@zauberware.com</code> and the
          password <code>demo123</code>.
        </P>
        { data && !data.login && 
          <Box bg='red' p={3} my={3}>
            <P mt={0}color='white'>Wrong email or password</P>
          </Box> 
        }
        <Label>
          Login
          <Input
            type='text'
            name='login'
            autoComplete='login'
            value={email}
            onChange={this.onChange}
            ref={this.emailInput}
            placeholder='Enter login'
            required={true}
          />
        </Label>
        <Label>
          Password
          <Input
            type='password'
            autoComplete='current-password'
            name='password'
            value={password}
            onChange={this.onChange}
            ref={this.passwordInput}
            placeholder='Enter password'
            required={true}
          />
        </Label>
        <Button 
          variant='primary' 
          type='submit'
          my={3}>Log in</Button>
      </form>
    )
  }

}

export default Form

const LOGIN = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`