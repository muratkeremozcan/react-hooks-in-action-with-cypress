import BookablesView from './BookablesView'
import { mount } from '@cypress/react'
import '../../App.css'

describe('BookablesView', () => {
  it('should render the child BookablesList, but not render the other child BookableDetails ', () => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    mount(<BookablesView />)
    cy.getByCy('bookables-list').should('be.visible')

    cy.log('due to conditional rendering, the other child does not render')
    cy.getByCy('bookable-details').should('not.exist')
  })

  // parent child component vs end to end tests

  // the only way the following  test would work is if the component was destructuring its children
  // because of this, test the details at the children, and at the parent test whether the children render or not

  //   export default function BookablesView({ children }) {
  //   const [bookable, setBookable] = useState()

  //   return (
  //     <Fragment data-cy="bookables-view">
  //       <BookablesList bookable={bookable} setBookable={setBookable} />
  //       <BookableDetails bookable={bookable} />
  //       {children}
  //     </Fragment>
  //   )
  // }
  /*
  it('should render the child BookablesList, but not render the other child BookableDetails ', () => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    cy.fixture('bookables').then((bookableData) =>
      mount(
        <BookablesView>
          <BookablesList
            bookable={bookableData[0]}
            setBookable={cy.spy().as('setBookable')}
          />
          <BookableDetails bookable={bookableData[0]} />
        </BookablesView>
      )
    )

    cy.getByCy('bookables-list').should('be.visible')

    cy.log('due to conditional rendering, the other child does not render')
    cy.getByCy('bookable-details').should('be.visible')
  })
  */

  // for a full cycle parent child coverage, these tests would have to be e2e
  // because a list depends on having a bookable
  // unless state can be set via app actions or another way these cannot be tested at component level
  /*

    it('should click and highlight the list item and ch[5.4] the focus should be on Next button', () => {
      cy.get('.btn').eq(1).click()
      checkBtnColor(1, 'rgb(23, 63, 95)')
      checkBtnColor(0, 'rgb(255, 255, 255)')
      cy.getByCy('next-btn').should('be.focused')
    })

    it('should switch to the next bookable and keep cycling with next button', () => {
      cy.getByCy('next-btn').click()
      checkBtnColor(1, 'rgb(23, 63, 95)')
      checkBtnColor(0, 'rgb(255, 255, 255)')

      cy.getByCy('next-btn').click().click().click()
      checkBtnColor(0, 'rgb(23, 63, 95)')
    })

    it('selects the other dropdown list of items', () => {
      cy.get('select').select(1)
      cy.get('.btn').first().contains('Projector')
    })

    it('should retain the details between bookables', () => {
      cy.get('.bookable-availability > >').should('have.length.gt', 0)

      cy.getByCy('next-btn').click()
      cy.get('.bookable-availability > >').should('have.length.gt', 0)
    })

    */
})
