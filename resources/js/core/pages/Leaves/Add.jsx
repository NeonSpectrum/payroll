import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import autobind from 'autobind-decorator'

import Api from '../../../core/assets/Api'
import Form from './Form'
import messages from '../../../core/strings/messages'
import Button from '../../../core/components/Button'
import { parseForm } from '../../../core/assets/Helper'

export class Add extends Component {
  state = { isSubmitting: false }

  @autobind
  async handleSubmit(e) {
    e.preventDefault()

    this.setState({ isSubmitting: true })

    const leave = new Api('leaves')
    try {
      await leave.add(parseForm(e.target))
      alert(messages.SAVED_SUCCESS)
      this.props.history.push(this.props.base)
    } catch (err) {
      alert(messages.SERVER_ERROR)
      console.log(err)
    } finally {
      this.setState({ isSubmitting: false })
    }
  }

  render() {
    return (
      <div>
        <h2>Add Leave</h2>
        <Form type='add' onSubmit={this.handleSubmit}>
          <div className='form-group align-center'>
            <Button className='btn btn-primary btn-rounded' loading={this.state.isSubmitting}>
              Save
            </Button>
            <button
              type='button'
              className='btn btn-light btn-rounded'
              onClick={() => {
                this.props.history.goBack()
              }}
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    )
  }
}

export default withRouter(Add)
