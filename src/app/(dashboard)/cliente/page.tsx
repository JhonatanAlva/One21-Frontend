'use client'

import React, { useMemo, useState } from 'react'

import type { ColumnDef } from '../../../components/datagrid/DataGrid'
import DataGrid from '../../../components/datagrid/DataGrid'
import SearchBar from '../../../components/datagrid/SearchBar'
import PageSizer from '../../../components/datagrid/Pagesizer'
import StatusSwitch from '../../../components/datagrid/StatusSwitch'
import RowActions from '../../../components/datagrid/RowActions'

type Empleado = {
  id: number
  nombre: string
  email: string
  telefono: string
  fecha: string
  activo: boolean
}

const MOCK: Empleado[] = [
  {
    id: 1,
    nombre: 'John Doe',
    email: 'john@example.com',
    telefono: '123-456-7890',
    fecha: '2023-05-14',
    activo: true
  },
  {
    id: 2,
    nombre: 'Jane Smith',
    email: 'jane@example.com',
    telefono: '987-654-3210',
    fecha: '2023-06-19',
    activo: false
  }
]

export default function Page() {
  const [data, setData] = useState<Empleado[]>(MOCK)
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return data

    return data.filter(
      r =>
        r.nombre.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.telefono.toLowerCase().includes(q)
    )
  }, [query, data])

  const columns: ColumnDef<Empleado>[] = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'email', header: 'Correo Electrónico' },
    { key: 'telefono', header: 'Teléfono' },
    {
      key: 'fecha',
      header: 'Fecha',
      render: row => new Date(row.fecha).toLocaleDateString()
    },
    {
      key: 'activo',
      header: 'Estado',
      render: row => (
        <StatusSwitch
          checked={row.activo}
          onChange={value => setData(prev => prev.map(r => (r.id === row.id ? { ...r, activo: value } : r)))}
        />
      )
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: row => (
        <RowActions
          onEdit={() => alert(`Editar empleado #${row.id}`)}
          onDelete={() => setData(prev => prev.filter(r => r.id !== row.id))}
        />
      )
    }
  ]

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Empleados</h1>
        <button
          onClick={() => alert('Agregar empleado')}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          + Agregar empleado
        </button>
      </div>

      {/* Toolbar */}
      <div className='flex items-center justify-between gap-4'>
        <SearchBar value={query} onChange={setQuery} placeholder='Buscar...' />
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <span>Mostrar</span>
          <PageSizer value={pageSize} onChange={setPageSize} />
          <span>entradas</span>
        </div>
      </div>

      {/* DataGrid */}
      <DataGrid columns={columns} rows={filtered.slice(0, pageSize)} emptyMessage='No hay empleados para mostrar.' />
    </div>
  )
}
