import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils'
import '@testing-library/jest-dom'
import { fireEvent, waitFor } from '@testing-library/react';
import ResponsiveAppBar from './AppBar'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
//const constellationLogo = require('../../assets/img/constellation-logo.png')
//const url ='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png'

describe('AppBar component', () => {


    // const server = setupServer(
    //     rest.get('https://graph.microsoft.com/v1.0/me/photo/$value', async (_, res, ctx) => {
    //         // Convert "base64" image to "ArrayBuffer".
    //     console.log('first')
    //         const imageBuffer = await fetch(require('../../assets/img/constellation-logo.png')).then((res) => {
    //             return res.arrayBuffer()
    //         })
    //         return res(
    //             ctx.set('Content-Length', imageBuffer.byteLength.toString()),
    //             ctx.set('Content-Type', 'image/png'),
    //             // Respond with the "ArrayBuffer".
    //             ctx.body(imageBuffer),
    //         )
    //     }),
    // )

    //beforeAll(() => server.listen())
    //afterAll(() => server.close())

    
    it('should show the current count', async () => {
        const { queryByAltText } = await renderWithProviders(<ResponsiveAppBar />);
        await waitFor(()=>expect(queryByAltText('Profile picture')).toBeInTheDocument())
        //expect(getByAltText('Profile picture')).toBeInTheDocument();

    });
    
});

 