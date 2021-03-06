import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { withRouter } from 'react-router-dom'

import Api from '../../../../core/assets/Api'
import Loader from '../../../../core/components/Loader'

import messages from '../../../../core/strings/messages'

export class Form extends Component {
  id = this.props.match.params.id
  state = {
    isLoading: true,
    salary: {}
  }

  componentDidMount() {
    Waves.attach('.btn')

    if (this.props.type == 'view' || this.props.type == 'edit') {
      this.fetchData()
    }
  }

  async fetchData() {
    const salary = new Api('salaries')

    try {
      const { data } = await salary.find(this.id)
      this.setState({ isLoading: false, salary: data })
      if (this.props.type == 'view') {
        $('form')
          .find('input, select')
          .prop('disabled', true)
      }
    } catch (err) {
      alert(messages.FETCH_FAIL)
      console.log(err)
    }
  }

  render() {
    const { onSubmit, type } = this.props
    const { salary, isLoading } = this.state

    return isLoading ? (
      <Loader />
    ) : (
      <form className='mt-3' onSubmit={onSubmit}>
        <input type='hidden' name='user_id' defaultValue={this.id} />
        <div className='row w-50'>
          <div className='form-group col-11'>
            <label>Daily</label>
            <input type='number' className='form-control' name='daily' defaultValue={salary.daily} />
          </div>
          <div className='form-group col-11'>
            <label>Monthly</label>
            <input type='number' className='form-control' name='monthly' defaultValue={salary.monthly} />
          </div>
        </div>
        {this.props.children}
      </form>
    )
  }
}

export default withRouter(Form)
