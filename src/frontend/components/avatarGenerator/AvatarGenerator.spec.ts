import '@testing-library/jest-dom'
import { generateColorHsl, stringAvatar } from './AvatarGenerator'

let testUser = 'john doe'

it('Take the user full name and return user initials in uppercase', () => {
    expect(stringAvatar(testUser)).toStrictEqual({ children: 'JD' })
})

it('Take users full name and return an HSL color string', () => {
    expect(generateColorHsl(testUser)).toBe('hsl(203, 38%, 23%)')
})