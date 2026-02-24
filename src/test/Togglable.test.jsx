import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from '../components/common/togglable'
import { beforeEach, describe, expect } from 'vitest'

describe('<Togglable />', () => {
    beforeEach(() => {
        render(
            <Togglable buttonLabel="show...">
                <div>Togglable content</div>
            </Togglable>
        )
    })

    test('Renders its children', () => {
        screen.getByText('Togglable content')
    })

    test('at start the children are not displayed', () => {
        const element = screen.getByText('Togglable content')
        expect(element).not.toBeVisible()
    })

    test('after clicking the button, children are displayed', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const element = screen.getByText('Togglable content')
        expect(element).toBeVisible()
    })

    test('togglable contents can be closed', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const closeButton = screen.getByText('Cancel')
        await user.click(closeButton)

        const element = screen.getByText('Togglable content')
        expect(element).not.toBeVisible()
    })
})