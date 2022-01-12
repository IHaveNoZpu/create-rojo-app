--// Services \\--
local ReplicatedStorage = game:GetService("ReplicatedStorage")

--// Imports \\--
local Knit = require(ReplicatedStorage:FindFirstChild("Packages"):FindFirstChild("Knit"))

--// Create Controller \\--
local HelloWorldController = Knit.CreateController {
	Name = "HelloWorldController",
	Client = {}
}

--// Functions \\--
function HelloWorldController:KnitStart()
	task.delay(2, function()
		print("Hello World From Client")
	end)
end

function HelloWorldController:KnitInit()
end

return HelloWorldController