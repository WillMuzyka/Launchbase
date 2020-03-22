double = (num, sum) => {
	const time = Math.floor(Math.random() * 1000)
	return new Promise(resolve => {
		setTimeout(() => resolve(num * 2 + sum), time)
	})
}

async function f1(nums) {
	let txt = 0
	for (num of nums) {
		txt = await double(num, txt)
		console.log(txt)
	}
}

nums = [0.5, 1, 1.5, 2, 2.5]
f1(nums)