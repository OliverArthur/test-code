export default class TableTemplate {

  /**
   * Creates an instance of tableTemplate.
   * @memberof tableTemplate
   */
  constructor() {
    this.renderHeaders = this.renderHeaders.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderBodys = this.renderBodys.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }


  /**
   * Render the table html
   *
   * @param {[ Object ]} data
   * @returns { String }
   * @memberof tableTemplate
   */
  tableMarkup(data) {
    const tableHeaderItems = this.renderHeaders(data.data);
    const tableBodyItems = this.renderBodys(data.data);
    return `<strong>table js version</strong>
      <div class="table table--js table--responsive" role="presentation">
        ${tableHeaderItems}
        ${tableBodyItems}
      </div>`;
  }

  /**
   * Map reduce of the table header options into a html entries
   *
   * @param {[ Object ]} data
   * @returns String
   * @memberof tableTemplate
   */
  renderHeaders(data = []) {
    return data
      .map(item => this.renderHeader(item)).reduce((html, row) => html + row, "");
  }

  /**
   * Map reduce of the table body options into a html entries
   *
   * @param {[ Object ]} data
   * @returns String
   * @memberof tableTemplate
   */
  renderBodys(data = []) {
    return data
      .map(item => this.renderBody(item)).reduce((html, row) => html + row, "");
  }


  /**
   * Render header table
   *
   * @param { Object } data
   * @returns { String }
   * @memberof tableTemplate
   */
  renderHeader(data) {
    if (!data) return null;
    return `
      ${data.assets.map(movie => `
        <div class="header">
          <div class="header_row">
            <div class="header_title">
            <button class="header_column class="btn btn--plain table__trigger" id="heading-${movie.id}" aria-controls="panel-${movie.id}"">
              <h2>
                <i class="ion ion-md-arrow-dropright"></i>${data.title}
              </h2>
              </button>
            </div>
          </div>
        </div>`).join('')}`
  }

  /**
   * Render body table
   *
   * @param { Object } data
   * @returns { String }
   * @memberof tableTemplate
   */
  renderBody(data) {
    if (!data) return null;
    return `
      ${data.assets.map(movie => `
        <div class="body"
        id="panel-${movie.id}"
        aria-labelledby="heading-${movie.id}"
        role="region">
          <span class="body_row">
            <div class="media">
              <p>${movie.title}</p>
              <a class="media_link" href="${movie.url}" title="${movie.title}">
                <img src="${movie.img}" alt="${movie.title}">
              </a>
              <p>imdb raking: ${movie.imdb}</p>
              <p>Genger: ${movie.genre}</p>
              <p>Genger: ${movie.genre}</p>
              <p>Type: ${movie.type}</p>
            </div>
          </span>
        </div>`).join('')}`
  }
}
