class AppFeatures{
    constructor(query,querystr){
        this.query =query;
        this.querystr = querystr
    }

    Search(){
        const keyword = this.querystr.keyword?{
            name:{
                $regex:this.querystr.keyword,
                $options:'i'
            }
        }:{}

        this.query =this.query.find({...keyword})
        return this
    }
    

   Filter(){
       const querycopy ={...this.querystr}
       const removefeild =["keyword","page","limit"]
       removefeild.forEach((key)=>delete querycopy[key])

       let querystr = JSON.stringify(querycopy)
       querystr =querystr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`)

       this.query =this.query.find(JSON.parse(querystr))
       return this
   }
  
   pagination(pagesize){

    const PageNo = Number(this.querystr.page) ||1
    const skip = (PageNo -1)*pagesize
    
    this.query = this.query.limit(pagesize).skip(skip)
    return this


   }
   
}

module.exports =AppFeatures