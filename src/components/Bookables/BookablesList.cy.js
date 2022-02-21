import { mount } from '@cypress/react'
import BookablesList from './BookablesList'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

// the data is static at the component
// in a real world case we would intercept and stub that at the test

describe('BookablesList', { viewportWidth: 900, viewportHeight: 700 }, () => {
  it('should render spinner', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/bookables'
      },
      {
        delay: 100,
        fixture: 'bookables'
      }
    ).as('bookablesStubDelayed')

    mount(
      <BookablesList
        bookable={bookableData[0]}
        setBookable={cy.spy().as('setBookable')}
      />
    )
    cy.getByCy('spinner').should('be.visible')
    cy.wait('@bookablesStubDelayed')
    cy.getByCy('spinner').should('not.exist')
  })

  it('should render error', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/bookables'
      },
      {
        statusCode: 500
      }
    ).as('bookablesStubError')

    mount(
      <BookablesList
        bookable={bookableData[0]}
        setBookable={cy.spy().as('setBookable')}
      />
    )
    cy.wait('@bookablesStubError')
    cy.getByCy('error').should('be.visible')
  })

  context('Populated list', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:3001/bookables', {
        fixture: 'bookables'
      }).as('bookablesStub')

      cy.fixture('bookables').then((bookableData) => {
        mount(
          <BookablesList
            bookable={bookableData[0]}
            setBookable={cy.spy().as('setBookable')}
          />
        )
      })
    })

    it('should have a list item highlighted', () => {
      checkBtnColor(0, 'rgb(23, 63, 95)')
      checkBtnColor(1, 'rgb(255, 255, 255)')
    })

    it('should call set bookable on any interaction with the list', () => {
      cy.get('.btn').last().click()
      cy.getByCy('next-btn').click()
      cy.get('select').select(1)
      cy.get('@setBookable').should('be.called', 'thrice')
    })
  })

  // @featureFlag candidate
  // it('should switch to the previous bookable and keep cycling with next button', () => {
  //   cy.getByCy('prev-btn').click()
  //   checkBtnColor(3, 'rgb(23, 63, 95)')
  //   checkBtnColor(0, 'rgb(255, 255, 255)')

  //   cy.getByCy('prev-btn').click().click().click()
  //   checkBtnColor(0, 'rgb(23, 63, 95)')
  // })

  // @featureFlag candidate
  // context('useRef', () => {
  //   it('should go through a presentation changing the bookable every 3 seconds', () => {
  //     cy.clock()

  //     cy.intercept('GET', 'http://localhost:3001/bookables', {
  //       fixture: 'bookables'
  //     }).as('bookablesStub')

  //     mount(<BookablesList />)
  //     cy.wait('@bookablesStub')

  //     for (let i = 0; i <= 3; i++) {
  //       checkBtnColor(i, 'rgb(23, 63, 95)')
  //       cy.tick(3000)
  //     }
  //     checkBtnColor(0, 'rgb(23, 63, 95)')
  //   })
  // })
})
