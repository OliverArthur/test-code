import { closest } from '../helpers/dom'
import TableTemplate from './table.template'
import MoviesService from '../services/movies.service'

/**
 * Table component
 *
 * @export
 * @class Table
 */
export default class Table {

  /**
   * Creates an instance of Table.
   *
   * @param { Object } [props={}]
   * @memberof Table
   */
  constructor(props = {}) {
    this.$element = document.getElementById(props.element)
    this.$body = document.getElementsByTagName('body')
    this.$tables = document.querySelectorAll(props.table)
    this.$responsiveTables = document.querySelectorAll(props.table + props.modifier)

    this.onLoad = this.onLoad.bind(this)
    this.onClick = Table.onClick.bind(this)

    // Kicking off the component.
    this.init()
  }

  /**
   * Attaches all events to DOM elements.
   *
   * @memberof Table
   */
  init() {
    if (!this.$tables) {
      return
    }


    window.addEventListener('load', this.onLoad, false)

    document.addEventListener('click', Table.triggerModal, false)

    this.$tables.forEach(($table) => {
      $table.addEventListener('click', Table.onClick, false)
      $table.addEventListener('keydown', Table.onKeyDown, false)
      $table.addEventListener('click', Table.triggerModal, false)
    })
  }

  /**
   * Deattaches all events to DOM elements.
   *
   * @memberof Table
   */
  destroy() {
    if (!this.$tables) {
      return
    }

    window.removeEventListener('load', this.onLoad, false)

    this.$tables.forEach(($table) => {
      $table.removeEventListener('click', Table.onClick, false)
      $table.removeEventListener('keydown', Table.onKeyDown, false)
      $table.addEventListener('click', Table.triggerModal, false)
    })
  }

  /**
   * Closes a table by its trigger button.
   *
   * @param {any} trigger
   * @memberof Table
   */
  static closeTable($trigger) {
    // Close the activated table, using aria-controls to specify the desired section.
    document.getElementById($trigger.getAttribute('aria-controls')).setAttribute('hidden', '')
    // Set the expanded state on the triggering element.
    $trigger.setAttribute('aria-expanded', 'false')

    const icon = $trigger.querySelector('.ion-md-arrow-dropdown')
    icon.classList.remove('ion-md-arrow-dropright')
    icon.classList.add('ion-md-arrow-dropright')
  }

  /**
   * Opens an table by its trigger button.
   *
   * @param {any} trigger
   * @memberof Table
   */
  static openTable($trigger) {
    const $element = document.getElementById($trigger.getAttribute('aria-controls'))

    if ($element) {
      // Open the activated table, using aria-controls to specify the desired section.
      $element.removeAttribute('hidden')

      // Set the expanded state on the triggering element.
      $trigger.setAttribute('aria-expanded', 'true')

    }
    const icon = $trigger.querySelector('.ion-md-arrow-dropright')
    icon.classList.remove('ion-md-arrow-dropright')
    icon.classList.add('ion-md-arrow-dropdown')
  }

  /**
   * Reacts to click events on element.
   *
   * @param {Event} e
   * @memberof Table
   */
  static onClick(event) {
    let target
    if (event.target.classList.contains('table__trigger')) {
      target = event.target
    } else if (event.target.parentNode.classList.contains('table__trigger')) {
      target = event.target.parentNode
    } else {
      return
    }

    const isExpanded = target.getAttribute('aria-expanded') === 'true'

    if (isExpanded) {
      Table.closeTable(target)
    } else if (!isExpanded) {
      Table.openTable(target)
    }

    event.preventDefault()
  }

  /**
   * Reacts to keydown events on elements to help
   * our users to focus on the right row after
   * pressing any key.
   *
   * It reacts to the following key press events:
   *
   * 33 = Page Up
   * 34 = Page Down
   * 35 = End
   * 36 = Home
   * 38 = Up
   * 40 = Down
   *
   * @param {Event} e
   * @memberof Table
   */
  static onKeyDown(event) {
    const target = event.target
    const $table = closest(target, 'table')
    const $triggers = $table.querySelectorAll('.table__trigger')
    const $panels = $table.querySelectorAll('.table__trigger')
    const key = event.which.toString()
    // 33 = Page Up, 34 = Page Down.
    const ctrlModifier = (event.ctrlKey && key.match(/33|34/))

    // Is this coming from an table header?
    if (target.classList.contains('table__trigger')) {
      if (key.match(/38|40/) || ctrlModifier) {
        // 38 = Up, 40 = Down, ctrlModifier = Page Up/Page Down.
        const index = Array.from($triggers).indexOf(target)
        const direction = (key.match(/34|40/)) ? 1 : -1
        const length = $triggers.length
        const newIndex = (index + length + direction) % length
        $triggers[newIndex].focus()
      } else if (key === '35') {
        // 35 = End.
        $triggers[$triggers.length - 1].focus()
      } else if (key === '36') {
        // 36 = Home.
        $triggers[0].focus()
      }
    } else if (ctrlModifier) {
      // Control + Page Up/Page Down keyboard operations.
      // Catches events that happen inside of panels.
      $panels.forEach(($panel, index) => {
        if ($panel.contains(target)) {
          $triggers[index].focus()
          event.preventDefault()
        }
      })
    }
  }


  /**
   * Call the Api and render the table
   *
   * @returns {[ Object ]}
   * @memberof Table
   */
  async onLoad() {
    try {
      const payload = await MoviesService.fetchMovies()
      this.renderTable(payload)
      this.addClickListener()
      return payload
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Initialize the table template
   * and render the html with the data from APi
   *
   * @param {[Object]} data
   * @memberof Table
   */
  renderTable(data) {
    const tableTpl = new TableTemplate()
    this.$element.innerHTML = tableTpl.tableMarkup(data)
  }

  /**
   * Adds click listener for each row trigger
   *
   * @memberof Table
   */
  addClickListener() {
    this.$elmTrigger = document.querySelectorAll('.table__trigger')

    this.$elmTrigger.forEach(($trigger) => {
      $trigger.addEventListener('click', Table.onClick, false)
    })
  }
}
