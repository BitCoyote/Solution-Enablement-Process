import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils'
import '@testing-library/jest-dom'
import Counter from './Counter';
import { CounterState } from '../../services/conterSlice/counterSlice';
import { fireEvent } from '@testing-library/react';

describe('Counter component', () => {
    const initialState: { counter: CounterState } = {
        counter: {
            value: 1,
            status: 'idle'
        }
    };

    it('should show the current count', async () => {
        const { getByText } = renderWithProviders(<Counter />, { preloadedState: initialState });
        expect(getByText(initialState.counter.value)).toBeInTheDocument();
    });
    it('should add 1 to the count when the "+" button is clicked', async () => {
        const { getByText, getByLabelText } = renderWithProviders(<Counter />, { preloadedState: initialState });
        expect(getByText(initialState.counter.value)).toBeInTheDocument();
        await fireEvent.click(getByLabelText("Increment value"));
        expect(getByText(initialState.counter.value + 1)).toBeInTheDocument();
    });
    it('should subtract 1 from the count when the "-" button is clicked', async () => {
        const { getByText, getByLabelText } = renderWithProviders(<Counter />, { preloadedState: initialState });
        expect(getByText(initialState.counter.value)).toBeInTheDocument();
        await fireEvent.click(getByLabelText("Decrement value"));
        expect(getByText(initialState.counter.value - 1)).toBeInTheDocument();

    });
    it('should add the selected amount when "Add Amount" is clicked', async () => {
        const { getByText, getByLabelText } = renderWithProviders(<Counter />, { preloadedState: initialState });
        expect(getByText(initialState.counter.value)).toBeInTheDocument();
        const input = (getByLabelText("Set increment amount") as HTMLInputElement);
        fireEvent.change(input, { target: { value: '12' } });
        expect(input).toHaveValue('12');
        await fireEvent.click(getByLabelText("Add amount"));
        expect(getByText(initialState.counter.value + 12)).toBeInTheDocument();
    });
    it('should add the selected amount shortly after "Add Async" is clicked', async () => {
        const { getByText, getByLabelText, findByText } = renderWithProviders(<Counter />, { preloadedState: initialState });
        expect(getByText(initialState.counter.value)).toBeInTheDocument();
        const input = (getByLabelText("Set increment amount") as HTMLInputElement);
        fireEvent.change(input, { target: { value: '12' } });
        expect(input).toHaveValue('12');
        await fireEvent.click(getByLabelText("Add async"));
        // Note the use of "findByText" instead of "getByText" to wait for async.
        expect(await findByText(initialState.counter.value + 12)).toBeInTheDocument();
    });
    it('should add the selected amount when "Add If Odd" is clicked if the current count is odd', async () => {
        const { getByText, getByLabelText } = renderWithProviders(<Counter />, { preloadedState: initialState });
        expect(getByText(initialState.counter.value)).toBeInTheDocument();
        const input = (getByLabelText("Set increment amount") as HTMLInputElement);
        fireEvent.change(input, { target: { value: '12' } });
        expect(input).toHaveValue('12');
        await fireEvent.click(getByLabelText("Add if odd"));
        expect(getByText(initialState.counter.value + 12)).toBeInTheDocument();
    });

    it('should not add the selected amount when "Add If Odd" is clicked if the current count is even', async () => {
        const { getByText, getByLabelText } = renderWithProviders(<Counter />, { preloadedState: { counter: { value: 2, status: 'idle' } } });
        expect(getByText(2)).toBeInTheDocument();
        const input = (getByLabelText("Set increment amount") as HTMLInputElement);
        fireEvent.change(input, { target: { value: '12' } });
        expect(input).toHaveValue('12');
        await fireEvent.click(getByLabelText("Add if odd"));
        expect(getByText(2)).toBeInTheDocument();
    });

    it('should not add anything if a number is not typed in the input', async () => {
        const { getByText, getByLabelText } = renderWithProviders(<Counter />, { preloadedState: initialState });
        expect(getByText(initialState.counter.value)).toBeInTheDocument();
        const input = (getByLabelText("Set increment amount") as HTMLInputElement);
        fireEvent.change(input, { target: { value: 'not a real number!' } });
        expect(input).toHaveValue('not a real number!');
        await fireEvent.click(getByLabelText("Add amount"));
        expect(getByText(initialState.counter.value)).toBeInTheDocument();
    });

});
