import { filterEmptyContestants } from '../app/utils/wikiFetch'

describe('filterEmptyContestants', () => {
    it('should make sure that contestants without names are not returned', () => {
        const inputContestants = [
            {},
            {name: "some name"}
        ]
        const result = filterEmptyContestants(inputContestants)

        expect(result).not.toHaveLength(2)
    })
})
