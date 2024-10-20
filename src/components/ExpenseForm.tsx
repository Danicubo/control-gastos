import { categories } from "../data/categories";
import type { DraftExpense, Value } from "../types";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })
    const [error,  setError] = useState('')
    const [previusAmount, setPreviusAmount] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        if(state.editingId) {
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviusAmount(editingExpense.amount)
        }

    },[state.editingId])

    const handleChange = (e : ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name] : isAmountField ? +value : value
        })

    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
        
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(Object.values(expense).includes('')){
            setError('Todos los campos son obligatorios')
            return
        }

        //Validar que no se pase el limite
        if((expense.amount - previusAmount) > remainingBudget){
            setError('Presupuesto rebasado')
            return
        }



        //Agregar o actualizar el gasto
        if(state.editingId  ) {
            dispatch({type: 'update-expense', payload: { expense: {id: state.editingId, ...expense} }})
        } else {
            dispatch({type: 'add-expense', payload: {expense}})
        }


        //Reiniciar el state
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })

        setPreviusAmount(0)
    }

  return (
    <>
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend 
            className="uppercase text-center text-2xl font-black border-b-4 border-blue-500">
                {state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
            </legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">
                    Nombre de Gasto:
                </label>
                <input 
                type="text" 
                value={expense.expenseName} 
                id="expenseName" 
                placeholder="Añade el nombre del gasto" 
                className="bg-slate-100 p-2" 
                name="expenseName" 
                onChange={handleChange}/>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">
                    Cantidad:
                </label>
                <input 
                type="number"
                value={expense.amount} 
                id="amount" 
                placeholder="Añade la cantidad del gasto ej. 300" 
                className="bg-slate-100 p-2" 
                name="amount"
                onChange={handleChange}/>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">
                    Categoría:
                </label>
                <select 
                id="category" 
                value={expense.category} 
                className="bg-slate-100 p-2" 
                name="category"
                onChange={handleChange}
                >
                    <option value="">-- Seleccione --</option>
                    {categories.map( category => (
                        <option value={category.id} key={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">
                    Fecha Gasto:
                </label>
                <DatePicker 
                value={expense.date}
                className="bg-slate-100 p-2 border-0"
                onChange={handleChangeDate}
                /> 
            </div>
            </div>

            <input type="submit" 
            className= "bg-blue-600 cursor-pointer w-full p-2 text-white font-bold uppercase rounded-lg" 
            value={state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
            />
        </form>
    
    </>

  )
}
