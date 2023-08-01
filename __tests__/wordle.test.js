import { jest } from '@jest/globals'

const mockIsWord = jest.fn(() => true)

jest.unstable_mockModule('../src/words.js', () => {
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: mockIsWord,
    } 
})

const { buildLetter, Wordle } = await import("../src/wordle");

describe('building a letter object', () => {
    it('returns a letter object', () => {
        expect(buildLetter('N', 'online')).toEqual({ letter: 'N', status: "online" })
    })
})

describe('testing the lodash words', () => {
    it('checks the value of its word property = APPLE', () => {
        const wordle = new Wordle();
        expect(wordle.word).toBe('APPLE')
    })
})

describe('constructing a new Wordle game', () => {
    it('sets maxGuesses to 6 if no argument is passed', () => {
        const wordle = new Wordle();
        expect(wordle.maxGuesses).toBe(6)
    })

    it('sets maxGuesses to the argument passed', () => {
        const wordle = new Wordle(10);
        expect(wordle.maxGuesses).toBe(10);
    })

    it('sets guesses to an array of length maxGuesses', () => {
        const wordle = new Wordle();
        expect(wordle.guesses.length).toBe(6)
    })

    it('sets currGuess to 0', () => {
        const wordle = new Wordle();
        expect(wordle.currGuess).toBe(0)
    })
})

describe('testing the buildGuessFromWord function', () => {
    it('test the status of a correct letter', () => {
        const wordle = new Wordle();
        const guess = wordle.buildGuessFromWord('A____')
        expect(guess[0]).toEqual({letter: 'A', status: 'CORRECT'})
    })

    it('tests the status of a present letter', () => {
        const wordle = new Wordle();
        const guess = wordle.buildGuessFromWord('E____')
        expect(guess[0]).toEqual({ letter: 'E', status: 'PRESENT' })
    })

    it('tests the status of an absent letter', () => {
        const wordle = new Wordle();
        const guess = wordle.buildGuessFromWord('Z____')
        expect(guess[0]).toEqual({ letter: 'Z', status: 'ABSENT' })
    })
})

describe('testing the appendGuess', () => {
    it('throws an error if no more guesses are allowed', () => {
        const wordle = new Wordle(1);
        wordle.appendGuess('GUESS');
        expect(() => {
            wordle.appendGuess('ANOTHERGUESS');
        }).toThrow();
    })

    it('throws an error if the guess is not of length 5', () => {
        const wordle = new Wordle();
        expect(() => {
            wordle.appendGuess('LONGESTGUESSEVER')
        }).toThrow();
    })

    it('throws an error if the guess is not a word', () => {
        const wordle = new Wordle();
        mockIsWord.mockReturnValueOnce(false);

        expect(() => {
            wordle.appendGuess('GUESS')
        }).toThrow();
    })

    it('should increment the current guess', () => {
        const wordle = new Wordle();
        wordle.appendGuess('GUESS');
        expect(wordle.currGuess).toBe(1)
    })
})

describe('testing the isSolved function', () => {
    it('should return true if guess is the correct word', () => {
        const wordle = new Wordle();
        wordle.appendGuess('APPLE');
        expect(wordle.isSolved()).toBe(true);
    })

    it('should return false if guess is NOT the correct word', () => {
        const wordle = new Wordle();
        wordle.appendGuess('GUESS');
        expect(wordle.isSolved()).toBe(false);
    })
})

describe('testing the shouldEndGame function', () => {
    it('return true if the latest guess is the correct word', () => {
        const wordle = new Wordle();
        wordle.appendGuess('APPLE');
        expect(wordle.shouldEndGame()).toBeTruthy();
    })

    it('returns true if there is no more guesses left', () => {
        const wordle = new Wordle(1);
        wordle.appendGuess('GUESS');
        expect(wordle.shouldEndGame()).toBe(true);
    })

    it('returns false if no guess has been made', () => {
        const wordle = new Wordle();
        expect(wordle.shouldEndGame()).toBe(false);
    })

    it('returns false if guesses are left and the word has not been guesses', () => {
        const wordle = new Wordle();
        wordle.appendGuess('GUESS');
        expect(wordle.shouldEndGame()).toBe(false)
    })
})
