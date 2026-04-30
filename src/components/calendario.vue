<!-- Calendário interativo com navegação entre meses -->
<template>
  <div class="card calendar-card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <button class="btn btn-sm btn-outline-secondary me-2" @click="prevMonth" aria-label="Mês anterior">
          ‹
        </button>
        <button class="btn btn-sm btn-outline-secondary me-2" @click="goToToday" aria-label="Hoje">
          Hoje
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="nextMonth" aria-label="Próximo mês">
          ›
        </button>
      </div>

      <div class="fw-semibold calendar-title">{{ monthLabel }}</div>

      <div class="text-end small text-muted">
        <div>{{ yearLabel }}</div>
      </div>
    </div>

    <div class="card-body p-3">
      <!-- Cabeçalho dias da semana -->
      <div class="d-flex calendar-weekdays mb-2">
        <div v-for="(w, i) in weekdays" :key="i" class="weekday text-center">{{ w }}</div>
      </div>

      <!-- Grade do mês -->
      <div class="calendar-grid">
        <div
          v-for="(cell, idx) in calendarGrid"
          :key="cell.key || idx"
          class="calendar-cell"
          :class="{
            'inactive': cell.isOtherMonth,
            'today': cell.isToday,
            'has-event': cell.events && cell.events.length,
            'selected': selectedKey === cell.key
          }"
          @click="onSelect(cell)"
          role="button"
          tabindex="0"
          @keyup.enter="onSelect(cell)"
        >
          <div class="cell-top d-flex justify-content-between align-items-start">
            <div class="day-label">{{ cell.label || '' }}</div>
            <div v-if="cell.events && cell.events.length" class="badge-count">{{ cell.events.length }}</div>
          </div>

          <div class="cell-events mt-1">
            <span
              v-for="(e, ei) in (cell.events || []).slice(0,2)"
              :key="ei"
              class="event-pill"
              :title="e.title || ''"
            >
              {{ (e.title || '').slice(0,14) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Legenda / Ações rápidas -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="small text-muted">Clique em um dia para ver ou criar atividade</div>
        <div>
          <button class="btn btn-sm btn-outline-primary" @click="emitVisibleRange">Ver período</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniCalendar',
  props: {
    // events: array de objetos { date: 'YYYY-MM-DD' | ISOString, title: 'texto', type: '...' }
    events: { type: Array, default: () => [] },
    // se true, marca visualmente dias com eventos
    markEvents: { type: Boolean, default: true },
    // mês/ano inicial (opcional)
    initYear: { type: Number, default: null },
    initMonth: { type: Number, default: null } // 0-11
  },
  data() {
    const now = new Date()
    return {
      viewYear: this.initYear ?? now.getFullYear(),
      viewMonth: this.initMonth ?? now.getMonth(),
      selectedKey: null
    }
  },
  computed: {
    weekdays() {
      // Monday-first
      return ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    },
    monthLabel() {
      const d = new Date(this.viewYear, this.viewMonth, 1)
      return d.toLocaleString('pt-PT', { month: 'long' })
    },
    yearLabel() {
      return String(this.viewYear)
    },
    monthLabelFull() {
      const d = new Date(this.viewYear, this.viewMonth, 1)
      return d.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })
    },
    // cria a grid do mês: array de células com { key, label, date, isToday, isOtherMonth, events }
    calendarGrid() {
      const year = Number(this.viewYear)
      const month = Number(this.viewMonth) // 0-11
      const firstOfMonth = new Date(year, month, 1)
      // JS getDay(): 0 (Dom) .. 6 (Sáb). Queremos Monday-first index 0..6
      const firstWeekdayIndex = (firstOfMonth.getDay() + 6) % 7 // Monday=0
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      // previous month tail
      const prevMonthDays = firstWeekdayIndex
      const prevMonthLastDate = new Date(year, month, 0).getDate() // último dia do mês anterior

      const cells = []
      // preencher dias do mês anterior (se houver)
      for (let i = 0; i < prevMonthDays; i++) {
        const dayNum = prevMonthLastDate - (prevMonthDays - 1) + i
        const dt = new Date(year, month - 1, dayNum)
        cells.push(this._makeCell(dt, true))
      }

      // preencher dias do mês atual
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month, d)
        cells.push(this._makeCell(dt, false))
      }

      // preencher começo do próximo mês para completar a grade (múltiplo de 7)
      while (cells.length % 7 !== 0) {
        const nextIndex = cells.length - (prevMonthDays + daysInMonth) + 1
        const dt = new Date(year, month + 1, nextIndex)
        cells.push(this._makeCell(dt, true))
      }

      return cells
    }
  },
  methods: {
    _normalizeDateKey(dt) {
      // formata YYYY-MM-DD (sem horas) para comparação consistente
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, '0')
      const d = String(dt.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },
    _makeCell(dt, isOtherMonth) {
      const key = this._normalizeDateKey(dt)
      const isToday = this._normalizeDateKey(new Date()) === key
      const events = this.markEvents ? this._eventsForDate(key) : []
      return {
        key,
        label: dt.getDate(),
        dateIso: dt.toISOString(),
        isToday,
        isOtherMonth,
        events
      }
    },
    _eventsForDate(key) {
      // aceita eventos com date em ISO ou 'YYYY-MM-DD'
      return this.events.filter(ev => {
        if (!ev || !ev.date) return false
        try {
          const evKey = (typeof ev.date === 'string' && ev.date.length === 10)
            ? ev.date
            : this._normalizeDateKey(new Date(ev.date))
          return evKey === key
        } catch (e) { return false }
      })
    },
    prevMonth() {
      if (this.viewMonth === 0) {
        this.viewMonth = 11
        this.viewYear -= 1
      } else {
        this.viewMonth -= 1
      }
      this.selectedKey = null
      this.$emit('month-changed', { year: this.viewYear, month: this.viewMonth })
    },
    nextMonth() {
      if (this.viewMonth === 11) {
        this.viewMonth = 0
        this.viewYear += 1
      } else {
        this.viewMonth += 1
      }
      this.selectedKey = null
      this.$emit('month-changed', { year: this.viewYear, month: this.viewMonth })
    },
    goToToday() {
      const now = new Date()
      this.viewYear = now.getFullYear()
      this.viewMonth = now.getMonth()
      this.selectedKey = this._normalizeDateKey(now)
      this.$emit('month-changed', { year: this.viewYear, month: this.viewMonth })
      this.$emit('day-selected', { date: now.toISOString(), events: this._eventsForDate(this.selectedKey) })
    },
    onSelect(cell) {
      if (!cell || !cell.key) return
      this.selectedKey = cell.key
      this.$emit('day-selected', { date: cell.dateIso, events: cell.events || [] })
    },
    emitVisibleRange() {
      // devolve o intervalo visível (primeiro e último dia do mês mostrado)
      const first = new Date(this.viewYear, this.viewMonth, 1)
      const last = new Date(this.viewYear, this.viewMonth + 1, 0)
      this.$emit('visible-range', { from: first.toISOString(), to: last.toISOString() })
    }
  }
}
</script>

<style scoped>
.calendar-card { border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.04); }
.calendar-title { text-transform: capitalize; font-size: 1rem; }

.calendar-weekdays { gap: .25rem; }
.weekday { flex: 1 0 0; padding: .25rem 0; font-weight: 600; color: #495057; text-align: center; }

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: .4rem;
  align-items: start;
}

/* cada célula do calendário */
.calendar-cell {
  min-height: 72px;
  border-radius: 8px;
  padding: .5rem;
  background: #ffffff;
  border: 1px solid transparent;
  transition: transform .08s ease, box-shadow .12s ease, border-color .08s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.calendar-cell:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.03); }

.calendar-cell.inactive { opacity: 0.45; background: #f8f9fa; }
.calendar-cell.today { border: 1px dashed #0d6efd; }
.calendar-cell.selected { outline: 2px solid rgba(13,110,253,0.12); box-shadow: 0 12px 24px rgba(13,110,253,0.06); }

.cell-top { font-size: .95rem; }
.day-label { font-weight: 600; color: #212529; }
.badge-count {
  background: #e9f2ff;
  color: #0d6efd;
  font-weight: 600;
  padding: .12rem .4rem;
  border-radius: 999px;
  font-size: .75rem;
}

/* eventos pequenos dentro da célula */
.cell-events { display:flex; flex-direction:column; gap:4px; margin-top:6px; }
.event-pill {
  display:inline-block;
  padding: 3px 6px;
  border-radius: 999px;
  font-size: .72rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
  background: #f1f1f1;
}

/* destaque quando há eventos */
.calendar-cell.has-event { border-left: 3px solid rgba(13,110,253,0.12); }

/* responsivo: diminuir altura em telas pequenas */
@media (max-width: 576px) {
  .calendar-card .card-body { padding: .75rem; }
  .calendar-cell { min-height: 58px; padding: .4rem; }
  .event-pill { font-size: .66rem; padding: 2px 5px; }
}
</style>
