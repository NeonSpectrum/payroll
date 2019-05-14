import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'

import Form from './Form'

export class View extends Component {
  render() {
    const { match } = this.props

    return (
      <div>
        <h2>View Salary</h2>
        <Link to={`${match.url}/edit`} className='btn btn-primary btn-rounded'>
          <i className='fas fa-edit' />
          Edit
        </Link>
        <Form id={this.props.id} type='view' />
      </div>
    )
  }
}

export default withRouter(View)
