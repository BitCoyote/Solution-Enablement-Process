import { BackendTestingGlobals } from '../../../../testing/types';
import {
  DataFieldOption,
  DataFieldUpdate,
} from '../../../shared/types/DataField';
describe('data-field module', () => {
  const globals = globalThis as unknown as BackendTestingGlobals;

  describe('PATCH /data-fields/{sepID}', () => {
    it('should successfully update and return the updated data fields ', async () => {
      const response = await globals.request
        .patch(`/data-fields/1`)
        .send([{ id: 2, value: 'Hello!' }])
        .expect(200);
      // Look for the updated field
      expect(response.body[0].value).toEqual('Hello!');
    });
    it('should successfully update and return the updated data field options ', async () => {
      const response = await globals.request
        .patch(`/data-fields/1`)
        .send([
          { id: 1, dataFieldOptions: [{ id: 1, selected: true }] },
        ] as DataFieldUpdate[])
        .expect(200);
      // Look for the updated field option
      expect(
        response.body[0].dataFieldOptions.find(
          (o: DataFieldOption) =>
            o.selected && o.id === 1 && o.selected === true
        )
      ).toBeDefined();
    });
  });
});
