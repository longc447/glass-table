export default {
	filters:{
		doller(num){
			num = num.toFixed(2)
			if(num>0) num = `+${num}`
			return num
		}
	}
}