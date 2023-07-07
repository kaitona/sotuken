import { useState } from "react";
import Button from 'react-bootstrap/Button';
import {ImCross} from 'react-icons/im';
function Textarea(props) {
    const img_input=props.variable;
    const setImg_input=props.set;

    const [image,setImage]=useState("");

    function add_img(){
        if(image){
            props.set([...img_input, image]);
            console.log(img_input);
            setImage("");
        }
    }
    function del_img(del_img){
        for(let i=0;i<img_input.length;i++){
            console.log(img_input[i]);
        }
        setImg_input(
            img_input.filter((img_, index) => (img_ !== del_img))
        )
    }
   
    
    return(
        //<Textarea name={"タイトル"} variable={title} set={setTitle}/>
        <div className='row  '>
            <div className='col-1'/>
            <div className='row col-10 left '>
                <p className="text-left"><font size="5">{props.name}</font> </p>
                <div className='col-1'/>
                < div className="col-11 center">
                    <div className="row">
                        <div className="col-9">
                        <textarea id="textarea" className="form-control" value={image} 
                            rows={image.split('\n').length}
                            aria-describedby="basic-addon1" 
                            onChange={(event) => setImage(event.target.value)}/>
                  
                        </div>
                        <div className="col-3">
                        <Button variant="primary" type="submit"  onClick={() => {add_img();}}>
                            追加
                        </Button>
                        </div>
                    </div>

                    <div className="row">
                        {img_input.map((url) => {
                            console.log(url);
                        return (
                            <img src={url}/>
                        );
                        })}
                    </div>

                </div>
                
               
            </div>
            <br/>
        </div>
    );
}
export default Textarea;