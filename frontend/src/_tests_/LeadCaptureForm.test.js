import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LeadCaptureForm from '../components/Forms/LeadCaptureForm';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

jest.mock('axios');

const renderWithFormik = (component) => {
    return render(
        <BrowserRouter>
             {component}
         </BrowserRouter>
    );
};
describe('LeadCaptureForm Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test('renders without crashing and displays the first step', async () => {
    renderWithFormik(<LeadCaptureForm />);

    const formElement = screen.getByTestId('lead-capture-form');
    expect(formElement).toBeInTheDocument();

     await waitFor(() =>  expect(screen.getByTestId('step-1-container')).toBeInTheDocument());

  });

  test('navigates through steps correctly and persists data', async () => {
    renderWithFormik(<LeadCaptureForm />);


       await waitFor(() =>  expect(screen.getByTestId('step-1-container')).toBeInTheDocument());
    // Fill Step 1
    await userEvent.type(screen.getByTestId('age-input'), '30');
    await userEvent.type(screen.getByTestId('annual-income-input'), '50000');
    await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    })



      await waitFor(() => expect(screen.getByTestId('step-2-container')).toBeInTheDocument());
     await userEvent.type(screen.getByTestId('monthly-expenses-input'), '2000');
    await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    })



     await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: /Previous/i }));
     })

     await waitFor(() =>   expect(screen.getByTestId('step-1-container')).toBeInTheDocument())

     expect(screen.getByTestId('age-input')).toHaveValue('30');
      expect(screen.getByTestId('annual-income-input')).toHaveValue('50000');


  });

 test('handles submission with valid data', async () => {
      axios.post.mockResolvedValue({ data: { scores: { financialHealthScore: 75 } } });
      renderWithFormik(<LeadCaptureForm />);
    await waitFor(() =>  expect(screen.getByTestId('step-1-container')).toBeInTheDocument());

    // Fill out all steps
     await userEvent.type(screen.getByTestId('age-input'), '30');
      await userEvent.type(screen.getByTestId('annual-income-input'), '50000');
       await act(async () => {
         await userEvent.click(screen.getByRole('button', { name: /Next/i }));
       })


      await waitFor(() => expect(screen.getByTestId('step-2-container')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('monthly-expenses-input'), '2000');
        await act(async () => {
          await userEvent.click(screen.getByRole('button', { name: /Next/i }));
        })


    await waitFor(() => expect(screen.getByTestId('step-3-container')).toBeInTheDocument());
         await userEvent.type(screen.getByTestId('total-assets-input'), '20000');
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    })


      await waitFor(() => expect(screen.getByTestId('step-4-container')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('credit-score-field'), '750');
        await act(async () => {
          await userEvent.click(screen.getByRole('button', { name: /Next/i }));
      })


    await waitFor(() => expect(screen.getByTestId('step-5-container')).toBeInTheDocument());
      await userEvent.type(screen.getByTestId('email-input'), 'test@test.com');
      await userEvent.type(screen.getByTestId('name-input'), 'test');
        await act(async () => {
            await userEvent.click(screen.getByRole('button', { name: /Submit/i }));
        })



    // Verify API submission
     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
       expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/submit'), expect.any(Object));
    });
});