import { useState, useRef, useEffect } from "react";
                  </div>
                ) : (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-foreground">{message.content}</p>
                  </div>
                )}
                <span className="text-xs text-muted-foreground block mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-muted-foreground" size={16} />
                </div>
              )}
            </div>
          ))}
          
          {chatMutation.isPending && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-primary-foreground" size={16} />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Ask about fraud patterns, risk factors..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={chatMutation.isPending}
            data-testid="input-chat"
          />
          <Button 
            onClick={handleSend}
            disabled={chatMutation.isPending || !input.trim()}
            size="icon"
            data-testid="button-send-chat"
          >
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
