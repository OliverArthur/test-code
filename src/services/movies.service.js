import { API_URI } from '../config/constant'

export default class MoviesService {
  /**
   * @static fetchMovies
   * @description fetch all the user movies
   *
   * @returns { Array }
   * @memberof MoviesServices
   */
  static async fetchMovies() {
    try {
      const response = await fetch(API_URI)
      const body = await response.json()
      return body
    } catch (err) {
      console.err(err.message)
    }
  }
}
