import e from"@anthropic-ai/sdk";let a=async(a="Hello, Claude",t="",{model:s="claude-3-5-sonnet-20241022",max_tokens:r=1024}={})=>{let l=new e({apiKey:t});return await l.messages.create({model:s,max_tokens:r,messages:[{role:"user",content:a}]})};export{a as chatClaude};