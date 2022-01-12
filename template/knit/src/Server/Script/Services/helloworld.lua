--// Services \\--
local ReplicatedStorage = game:GetService("ReplicatedStorage")

--// Imports \\--
local Knit = require(ReplicatedStorage:FindFirstChild("Packages"):FindFirstChild("Knit"))

--// Create Services \\--
local HelloWorldService = Knit.CreateService {
	Name = "HelloWorldService",
	Client = {}
}

--// Functions \\--
function HelloWorldService:KnitStart()
	task.delay(2, function()
		print("Hello World From Server")
	end)
end

function HelloWorldService:KnitInit()
end

return HelloWorldService