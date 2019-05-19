import React, { Fragment } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import gql from 'graphql-tag'
import { ThemeProvider } from 'styled-components'
import Cookies from 'universal-cookie'
import { Box } from '@magicsoup.io/stock'

import client from '../../apollo/client'
import store from '../../redux/store'
import { loginUser, logoutUser } from '../../redux/actions/userActions'

import Header from '../Header'
import Footer from '../Footer'

import theme from '../../styled/theme'
import GlobalStyle from '../../styled/global-styles'

const TOKEN_LOGIN = gql`
  {
    me {
      id
      username
      email
      role
    }
  }
`

class Layout extends React.Component {
  
  componentWillMount = async () => {

    const bearerToken = localStorage.getItem('bearer_token')

    if (bearerToken && bearerToken !== ''){
      
      // Login with bearerToken from localStorage
      store.dispatch(loginUser({ token: bearerToken }))
      const { data: {me} } = await client.query({
        query: TOKEN_LOGIN
      })

      const data = {tokenLogin: {token: bearerToken, firstName: me.username, lastName: me.email, email: me.email}}

      store.dispatch(loginUser(data.tokenLogin))
      this.setState(data)

      if (data.tokenLogin) localStorage.setItem('bearer_token', data.tokenLogin.token, '/')
      else localStorage.removeItem('bearer_token')
    }else{
      store.dispatch(logoutUser())
      this.setState({user: null})
    }
    
  }

  render() {
    const { children } = this.props
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <StaticQuery
            query={graphql`
              query SiteTitleQuery {
                site {
                  siteMetadata {
                    title
                  }
                }
              }
            `}
            render={data => (
              <Fragment>
                <Header siteTitle={data.site.siteMetadata.title} />
                <Box 
                  as='main' 
                  py={6}>
                  {children}
                </Box>
                <Footer />
              </Fragment>
            )}
          />
          <GlobalStyle />
        </Fragment>
      </ThemeProvider>
    )
  }
}



export default Layout

