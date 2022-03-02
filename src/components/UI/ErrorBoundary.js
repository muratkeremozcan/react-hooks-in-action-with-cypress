import { Component } from 'react'
// [11.3] Error boundary is a way for the app to show common error when lazy loaded components fail to load
// https://reactjs.org/docs/error-boundaries.html

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    const { children, fallback = <h1>Something went wrong.</h1> } = this.props

    return this.state.hasError ? fallback : children
  }
}
