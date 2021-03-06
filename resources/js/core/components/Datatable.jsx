import React, { Component } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BrowserRouter, withRouter, Link } from 'react-router-dom'
import autobind from 'autobind-decorator'

import Api from '../assets/Api'
import Button from './Button'
import messages from '../strings/messages'

export class Datatable extends Component {
  api = new Api(this.props.api)
  datatable = React.createRef()

  state = {
    isLoading: false,
    isDeleting: false,
    data: []
  }

  componentDidMount() {
    this.dtInit()
  }

  dtInit() {
    const { history, api, columns } = this.props

    this.dTable = $(this.datatable.current).DataTable({
      select: true,
      processing: true,
      serverSide: true,
      searchHighlight: true,
      language: {
        processing: 'Loading...'
      },
      ajax: {
        url: '/api/' + api + '?type=table',
        headers: {
          Authorization: localStorage.token ? 'Bearer ' + localStorage.token : null
        },
        error: () => {
          alert(messages.SERVER_ERROR)
        }
      },
      columns: [
        ...columns.map(column => ({
          data: column.key,
          sortable: column.sortable !== false,
          searchable: column.searchable !== false,
          render: data => {
            if (column.image) {
              return `<img src="${data}" alt='' height='80' width='80'>`
            }

            return data
          }
        })),
        {
          sortable: false,
          searchable: false,
          render: (data, type, row) => {
            return renderToStaticMarkup(this.actionsButton(row.id))
          }
        }
      ],
      fnDrawCallback: () => {
        const remove = this.delete

        Waves.attach('.btn')
        $(this.datatable.current)
          .find('a')
          .click(function(e) {
            if ($(this).attr('href')) {
              e.preventDefault()
              history.push($(this).attr('href'))
            } else if ($(this).hasClass('btn-delete')) {
              remove($(this).data('id'))
            }
          })
      },
      initComplete: () => {
        const { dTable } = this
        let timeout = null

        $('.dt-bootstrap4')
          .find('input[type=search]')
          .unbind()
        $('.dt-bootstrap4')
          .find('input[type=search]')
          .bind('keyup', function(e) {
            clearTimeout(timeout)

            timeout = setTimeout(() => {
              dTable.search(this.value).draw()
            }, 250)
          })
      }
    })
  }

  @autobind
  async delete(id) {
    if (confirm('Are you sure to you want to delete it?')) {
      try {
        await this.api.remove(id)
        alert(messages.DELETE_SUCCESS)
        this.dTable.ajax.reload()
      } catch (err) {
        console.log(err)
        alert(messages.DELETE_FAIL)
      }
    }
  }

  @autobind
  actionsButton(id) {
    const { match, excluded = [] } = this.props

    return (
      <>
        {excluded.indexOf('view') == -1 && (
          <a href={`${match.path}/${id}`} className='btn btn-primary btn-rounded btn-sm btn-block'>
            <i className='fas fa-eye' />
            View
          </a>
        )}
        {excluded.indexOf('edit') == -1 && (
          <a href={`${match.path}/${id}/edit`} className='btn btn-primary btn-rounded btn-sm btn-block'>
            <i className='fas fa-edit' />
            Edit
          </a>
        )}
        {excluded.indexOf('delete') == -1 && (
          <a className='btn btn-primary btn-rounded btn-sm btn-block btn-delete' data-id={id}>
            <i className='fas fa-trash' />
            Delete
          </a>
        )}
      </>
    )
  }

  @autobind
  fetchData() {
    this.setState({ isLoading: true })

    this.dTable.ajax.reload(() => {
      this.setState({ isLoading: false })
    })
  }

  render() {
    const { title, columns, match, excluded = [] } = this.props

    return (
      <>
        <div className='clearfix mb-2'>
          <h2 className='float-left'>{title}</h2>
          <div className='float-right'>
            <Button
              className='btn btn-primary btn-rounded btn-icon mr-2'
              onClick={this.fetchData}
              loading={this.state.isLoading}
            >
              <i className='fas fa-sync' />
            </Button>
            {excluded.indexOf('add') == -1 && (
              <Link to={`${match.path}/add`} className='btn btn-primary btn-rounded'>
                <i className='fas fa-plus' />
                Add
              </Link>
            )}
          </div>
        </div>
        <div className='card'>
          <div className='card-body'>
            <div className='table-responsive'>
              <table ref={this.datatable} className='table table-hover' width='100%'>
                <thead>
                  <tr>
                    {columns.map((item, key) => (
                      <th key={key} style={item.width ? { width: item.width } : {}}>
                        {item.label}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(Datatable)
