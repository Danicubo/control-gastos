import { FormEvent, useMemo, useState } from "react"
import { useBudget } from "../hooks/useBudget"

export default function BudgetForm() {

    const [budget, setBudget] = useState(0)
    const { dispatch } = useBudget()
    
    const handleChange = (e :  React.ChangeEvent<HTMLInputElement>) => {
        setBudget(e.target.valueAsNumber)
    }

    const isValid = useMemo(() => { //Espera que budget tenga contenido para realizar la validación
        return isNaN(budget) || budget <= 0
    }, [budget])

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({type: 'add-budget', payload: {budget}})
    }

  return (
    <>
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl font-bold text-center">
                    Definir Presupuesto
                </label>
                <input 
                id="budget"
                type="number"  
                className="w-full bg-white border border-gray-200 p-2"
                placeholder="Define tu Presupuesto"
                name="budget"
                value={budget}
                onChange={handleChange}
                />
            </div>

            <input type="submit" 
            value="Definir Presupuesto"
            className="w-full bg-lime-600 hover:bg-lime-700 cursor-pointer text-white font-black uppercase p-2 disabled:opacity-40"
            disabled={isValid} // isValid devuelve un valor true o false
            />
        </form>
    
    </>
  )
}
