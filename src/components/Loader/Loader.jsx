import DotLoader from "react-spinners/ClipLoader";
import s from './Loader.module.css';


export default function Loader(){
    return (
        <div className={s.overlay}>
        <DotLoader  size={450} color={'#0060D3'} className = {s.loader}/>
        </div>
    )
}