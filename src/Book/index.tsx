import "./index.css"

type Props = {
  name: string,
  author: string
}

const Book: React.FC<Props> = (props: Props) => {
  return(
    <div className="book">
    	<h1 className="name">{props.name}</h1>
    	<p className="author">{props.author}</p>
    </div>
  )
}

export default Book
