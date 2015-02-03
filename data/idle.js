document.addEventListener("mousemove", function(){
	self.port.emit('alive', true);
})
window.addEventListener("keydown", function(){
	self.port.emit('alive', true);
})
